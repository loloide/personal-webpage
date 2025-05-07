
export class cube {
    constructor(x, y, props) {
        this.x = x;
        this.y = y;
        this.props = props;
    }

    applyProps(props) {
        if (props.images) {
            for (var image in images) {
                image(
                    props.image.url,
                    this.x * grid - boxSize / 2,
                    this.y * grid - boxSize / 2,
                    boxSize,
                    boxSize
                );
            }
        }
        if (props.rects) {
            for (var recta in rects) {
                fill(props.recta.color, props.recta.alpha);
                rect(
                    this.x * recta.y,
                    this.y + recta.x,
                    recta.width,
                    recta.height
                );
            }
        }
        if (props.texts) {
            for (var text in props.texts) {
                textFont(window[text.fontName]);
                fill(text.color);
                textAlign(CENTER, BOTTOM);
                textSize(text.size);
                text(text.text, text.x, text.y, text.width, text.height);
            }
        }
        if (props.texture) {
            texture(edgesTexture);
        }
    }

    display() {
        push();
        this.applyProps(this.props);
        fill(this.props.color);
        box(boxSize, boxSize, boxSize * 25);

        pop();
    }
}
