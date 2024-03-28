export function convertZonesToJson(zones) {
    let annotations = []
    try {
        for (let i = 0; i < zones.length; i++) {
            let zone = zones[i];
            let annotation = {'target': {'selector': [{'type': 'SvgSelector'}]}}
            annotation.target.selector[0].value = "<svg><polygon points='" + zone.getAttribute('points') + "'></polygon></svg>";
            annotation.id = zone.getAttribute("xml:id");
            annotations.push(annotation);
        }
    }
    catch (e) {
        console.error(e)
    }

    return annotations;
}