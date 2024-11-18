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
import Cookies from "universal-cookie";
const cookies = new Cookies();

function AnnotationContainer({onSelection}) {

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
                onSelection(element.getAttribute('data-id'));
            });

            annotorious.loadAnnotations(createAnnotationUrl());
        }

        // Keep current Annotorious instance in state
        setAnno(annotorious);

        // Cleanup: destroy current instance
        return () => {
            annotorious.destroy();
        };
    }, []);

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

    function createAnnotationUrl() {
        const annotationJson = getAnnotationsFromXml('path')
        const blob = new Blob([JSON.stringify(annotationJson)], {type: "application/json"})
        // const blob = new Blob([JSON.stringify('')], {type: "application/json"})
        return(URL.createObjectURL(blob));
    }


    return (
        <div className={"h-100 d-flex flex-column"}>
            <TransformWrapper
                initialScale={0.2} // TODO: calculate this based on image width and element width
                minScale={0.05}
                // wheel={{disabled: true}}
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


export default AnnotationContainer;

