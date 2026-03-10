import React from 'react';
import { useReveal } from '../../Shared/hooks';

export function EditorialBand() {
    useReveal();

    return (
        <div className="rv editorial-band">
            <div className="band-item">
                <span className="band-number">01</span>
                <div>
                    <h4 className="band-label">Handcrafted</h4>
                    <p className="band-desc">Each piece meticulously crafted by skilled artisans</p>
                </div>
            </div>
            <div className="band-divider" />
            <div className="band-item">
                <span className="band-number">02</span>
                <div>
                    <h4 className="band-label">Sustainable</h4>
                    <p className="band-desc">Responsibly sourced materials & eco-conscious processes</p>
                </div>
            </div>
            <div className="band-divider" />
            <div className="band-item">
                <span className="band-number">03</span>
                <div>
                    <h4 className="band-label">Timeless</h4>
                    <p className="band-desc">Designs that transcend trends and last generations</p>
                </div>
            </div>
        </div>
    );
}
