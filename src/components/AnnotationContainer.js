import React from "react";
import { getAnnotationsFromXml } from '../util/annotation-util'
import {
    TransformWrapper,
    TransformComponent,
} from "react-zoom-pan-pinch";

import { useEffect, useRef, useState } from 'react';
import { Annotorious } from '@recogito/annotorious';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import Button from 'react-bootstrap/Button'
import '@recogito/annotorious/dist/annotorious.min.css';
import axios from "axios";
import UTIF from "utif";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function AnnotationContainer({importedImg, onSelection, setSelection, annoZones}) {

    // Ref to the image DOM element
    const imgEl = useRef();

    // The current Annotorious instance
    const [ anno, setAnno ] = useState();

    // Current drawing tool name
    const [ tool, setTool ] = useState('rect');

    const [imgURL, setImgURL] = useState('');

    const [panOrDraw, setPanOrDraw] = useState('pan')

    // Init Annotorious when the component
    // mounts, and keep the current 'anno'
    // instance in the application state
    useEffect(() => {
        let annotorious = null;

        if (imgEl.current) {
            // Init
            annotorious = new Annotorious({
                image: imgEl.current,
                disableEditor: true,
                readOnly: true
            });

            // Attach event handlers here
            annotorious.on('createAnnotation', annotation => {
                console.log('created', annotation);
            });

            annotorious.on('updateAnnotation', (annotation, previous) => {
                console.log('updated', annotation, previous);
            });

            annotorious.on('deleteAnnotation', annotation => {
                console.log('deleted', annotation);
            });

            annotorious.on('selectAnnotation', function(annotation, element) {
                setSelection(element.getAttribute('data-id'));
            });

            if (annoZones) annotorious.loadAnnotations(createAnnotationUrl());
        }

        // Keep current Annotorious instance in state
        setAnno(annotorious);

        // Cleanup: destroy current instance
        return () => {
            annotorious.destroy();
        };
    }, [annoZones]);

    // Toggles current tool + button label
    const toggleTool = () => {
        if (tool === 'rect') {
            setTool('polygon');
            anno.setDrawingTool('polygon');
        } else {
            setTool('rect');
            anno.setDrawingTool('rect');
        }
    }

    function onToolSelect(e) {
        setPanOrDraw(e.target.value);
        // TODO: figure out why this works the wrong way around
        anno.readOnly = panOrDraw === 'draw';
    }

    useEffect(() => {
        const configuration = {
            method: "get",
            url: "https://axolotl-server-db50b102d293.herokuapp.com/image",
            headers: {
                "Authorization": `Bearer ${cookies.get("TOKEN")}`
            },
            responseType: 'blob'
        };
        axios(configuration)
            .then((response) => {
                setImgURL(URL.createObjectURL(response.data));
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    useEffect(() => {
        if (importedImg) {
            setImgURL(URL.createObjectURL(importedImg));
        }
    }, [importedImg])

    //TODO: this has some problems when it's empty
    function createAnnotationUrl() {
        try {
            if (annoZones) {
                const blob = new Blob([JSON.stringify(annoZones)], {type: "application/json"})
                return (URL.createObjectURL(blob));
            }
            else return ''

        }
        catch (e) {
            console.error(e.message);
            return('');
        }
    }


    return (
        <div className={"h-100 d-flex flex-column"}>
            <TransformWrapper
                initialScale={0.2} // TODO: calculate this based on image width and element width
                minScale={0.05}
                wheel={{disabled: true}}
                panning={{disabled: (panOrDraw === 'draw')}}
                // minPositionX={0}
                // minPositionY={300}

                // centerOnInit={true}
                // centerZoomedOut={true}
                // limitToBounds={false}
                // disablePadding={true}
            >
                {({ zoomIn, zoomOut, resetTransform, centerView}) => (
                    <React.Fragment>
                        <div className="tools d-flex">
                            <Button variant="light" title={'zoom in'} onClick={() => zoomIn(0.1)}><FontAwesomeIcon icon={solid("magnifying-glass-plus")} /></Button>
                            <Button variant="light" title={'zoom out'} onClick={() => zoomOut(0.1)}><FontAwesomeIcon icon={solid("magnifying-glass-minus")} /></Button>
                            <Button variant="light" title={'reset zoom'} onClick={() => resetTransform()}><FontAwesomeIcon icon={solid("magnifying-glass")} /></Button>
                            <Button variant="light" title={'center view'} onClick={() => centerView()}><FontAwesomeIcon icon={solid("magnifying-glass-location")} /></Button>
                            <Button variant="light" title={'drag and move'} className={'drag-handle'}><FontAwesomeIcon icon={solid("up-down-left-right")} /></Button>
                            <span className="ms-auto p-2 d-inline-flex">
                            <div className="switcher" onChange={onToolSelect}>
                                  <input type="radio" name="tool-toggle" value="draw" id="draw" className="switcher__input switcher__input--draw" />
                                  <label htmlFor="draw" className="switcher__label">Draw</label>

                                  <input type="radio" name="tool-toggle" value="pan" id="pan" className="switcher__input switcher__input--pan" defaultChecked />
                                  <label htmlFor="pan" className="switcher__label">Pan</label>

                                  <span className="switcher__toggle"></span>
                            </div>

                            </span>
                        </div>
                        <div className="annotation">
                        <TransformComponent wrapperStyle={{ maxWidth: "100%", height:"100%", overflow: "hidden"}}>

                            <img className=""
                            ref={imgEl}
                            src={imgURL}/>

                        </TransformComponent>
                        </div>
                    </React.Fragment>
                )}
            </TransformWrapper>
        </div>
    );
}

// TODO: make use of this
function TiffImage({ src }) {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetch(src)
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.arrayBuffer();
            })
            .then((arrayBuffer) => {
                // Parse the TIFF file
                const tiffArray = new Uint8Array(arrayBuffer);
                const ifds = UTIF.decode(tiffArray);
                UTIF.decodeImages(tiffArray, ifds);
                const rgba = UTIF.toRGBA8(ifds[0]); // Assuming the TIFF has at least one image

                // Create a blob from the RGBA data
                const blob = new Blob([rgba], { type: 'image/png' });
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            })
            .catch((error) => console.error('Error:', error));
    }, [src]);

    return imageUrl ? <img src={imageUrl} alt="Tiff content" /> : <p>Loading...</p>;
}

export default AnnotationContainer;

