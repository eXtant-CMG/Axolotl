import React from "react";
import pic from '../assets/oxen.jpg';
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

function AnnotationContainer({onSelection}) {

    // Ref to the image DOM element
    const imgEl = useRef();

    // The current Annotorious instance
    const [ anno, setAnno ] = useState();

    // Current drawing tool name
    const [ tool, setTool ] = useState('rect');

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


    return (
        <div className={"h-100 d-flex flex-column"}>
            <TransformWrapper
                initialScale={1}
                minScale={0.05}
                wheel={{disabled: true}}
                panning={{disabled: true}}
                minPositionX={0}
                minPositionY={300}
                // centerOnInit={true}
                // centerZoomedOut={true}
                // limitToBounds={false}
                // disablePadding={true}
            >
                {({ zoomIn, zoomOut, resetTransform, centerView}) => (
                    <React.Fragment>
                        <div className="tools">
                            <Button variant="light" title={'zoom in'} onClick={() => zoomIn(0.1)}><FontAwesomeIcon icon={solid("magnifying-glass-plus")} /></Button>
                            <Button variant="light" title={'zoom out'} onClick={() => zoomOut(0.1)}><FontAwesomeIcon icon={solid("magnifying-glass-minus")} /></Button>
                            <Button variant="light" title={'reset zoom'} onClick={() => resetTransform()}><FontAwesomeIcon icon={solid("magnifying-glass")} /></Button>
                            <Button variant="light" title={'center view'} onClick={() => centerView()}><FontAwesomeIcon icon={solid("magnifying-glass-location")} /></Button>
                            <Button variant="light" title={'drag and move'} className={'drag-handle'}><FontAwesomeIcon icon={solid("up-down-left-right")} /></Button>
                        </div>
                        <div className="annotation">
                        <TransformComponent wrapperStyle={{ maxWidth: "100%", height:"100%", overflow: "scroll"}}>

                            <img className=""
                            ref={imgEl}
                            src={pic}/>

                        </TransformComponent>
                        </div>
                    </React.Fragment>
                )}
            </TransformWrapper>
        </div>
    );
}

function createAnnotationUrl() {
    const annotationJson = getAnnotationsFromXml('path')
    const blob = new Blob([JSON.stringify(annotationJson)], {type: "application/json"})
    return(URL.createObjectURL(blob));
}

export default AnnotationContainer;

