import ModalTag from './ui/ModalTag';
import CIQ from 'chartiq';

/**
 * Attribution web component `<cq-attribution>`.
 *
 * This will put a node inside a panel to attribute the data.
 * Both the main chart panel (for quotes) and a study panel can use an attribution.
 *
 * @namespace WebComponents.cq-attribution
 * @since 2016-07-16
 * @example
 * <cq-attribution>
 *     <template>
 *         <cq-attrib-container>
 *             <cq-attrib-source></cq-attrib-source>
 *             <cq-attrib-quote-type></cq-attrib-quote-type>
 *         </cq-attrib-container>
 *     </template>
 * </cq-attribution>
 */
class Attribution extends ModalTag {
    insert(stx, panel) {
        let attrib = CIQ.UI.makeFromTemplate(this.template);
        new CIQ.Marker({
            stx,
            node: attrib[0],
            xPositioner: 'none',
            yPositioner: 'none',
            label: 'attribution',
            panelName: panel,
        });
        return attrib;
    }

    attachedCallback() {
        if (this.attached) return;
        super.attachedCallback();
        this.attached = true;
    }

    setContext(context) {
        this.template = this.node.find('template');
        let chartAttrib = this.insert(context.stx, 'chart');
        let self = this;
        this.addInjection('append', 'createDataSet', function () {
            let source,
                exchange;
            if (this.chart.attribution) {
                source = self.messages.sources[this.chart.attribution.source];
                exchange = self.messages.exchanges[this.chart.attribution.exchange];
                if (!source) source = '';
                if (!exchange) exchange = '';
                if (source + exchange !== chartAttrib.attr('lastAttrib')) {
                    chartAttrib.find('cq-attrib-source').html(source);
                    chartAttrib.find('cq-attrib-quote-type').html(exchange);
                    CIQ.I18N.translateUI(null, chartAttrib[0]);
                    chartAttrib.attr('lastAttrib', source + exchange);
                }
            }
            outer:
            for (let study in this.layout.studies) {
                let type = this.layout.studies[study].type;
                if (self.messages.sources[type]) {
                    for (let i = 0; i < this.markers.attribution.length; i++) {
                        if (this.markers.attribution[i].params.panelName === this.layout.studies[study].panel) continue outer;
                    }
                    if (!this.panels[study]) continue;
                    source = self.messages.sources[type];
                    exchange = self.messages.exchanges[type];
                    if (!source) source = '';
                    if (!exchange) exchange = '';
                    let attrib = self.insert(this, study);
                    attrib.find('cq-attrib-source').html(source);
                    attrib.find('cq-attrib-quote-type').html(exchange);
                    CIQ.I18N.translateUI(null, attrib[0]);
                }
            }
        });
    }
}

/**
 * Here is where the messages go.  This could be supplemented, overridden, etc. by the developer.
 * The sources contain properties whose values which go into <cq-attrib-source>.
 * The exchanges contain properties whose values which go into <cq-attrib-quote-type>.
 *
 * For quotes, the sources would match the quote source.  For a study, it would match the study type.
 * If there is no matching property, the appropriate component will have no text.
 * @alias messages
 * @memberof WebComponents.cq-attribution
 */
Attribution.prototype.messages = {
    sources: {
        simulator: 'Simulated data.',
        demo: 'Demo data.',
        xignite: '<a target="_blank" href="https://www.xignite.com">Market Data</a> by Xignite.',
        Twiggs: 'Formula courtesy <a target="_blank" href="https://www.incrediblecharts.com/indicators/twiggs_money_flow.php">IncredibleCharts</a>.',
    },
    exchanges: {
        RANDOM: 'Data is randomized.',
        'REAL-TIME': 'Data is real-time.',
        DELAYED: 'Data delayed 15 min.',
        BATS: 'BATS BZX real-time.',
        EOD: 'End of day data.',
    },
};

document.registerElement('cq-attribution', Attribution);
export default Attribution;