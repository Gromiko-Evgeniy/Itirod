import React from 'react';
import styleClasses from './Modal.module.css';

const Modal = ({children, visible, setVisible}) => {

    const rootClasses = [styleClasses.Modal]

    if (visible) {
        rootClasses.push(styleClasses.active);
    }

    return (
        <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
            <div className={styleClasses.ModalContent} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;