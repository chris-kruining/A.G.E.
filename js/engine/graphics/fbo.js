export default class Fbo
{
    constructor(renderer)
    {
        this.gl = renderer.gl;
        this._renderer = renderer;
        this._buffer = this.gl.createFramebuffer();
        this._types = {
            color: {
                texture: this.gl.createTexture(),
                component: this.gl.RGBA8,
                attachment: this.gl.COLOR_ATTACHMENT0
            },
            depth: {
                texture: this.gl.createTexture(),
                component: this.gl.DEPTH_COMPONENT16,
                attachment: this.gl.DEPTH_ATTACHMENT
            },
        };

        this._renderer.on({
            resized: () => Object.keys(this._types).forEach(k => this.buffer(k)),
        });

        Object.keys(this._types).forEach(k => this.buffer(k));
    }

    bind()
    {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._buffer);
    }

    buffer(name)
    {
        if(Object.keys(this._types).includes(name) !== true)
        {
            throw new Error(`Can't buffer an unknown type (${name})`);
        }

        const { component, attachment } = this._types[name];
        const { width, height } = this._renderer;
        const texture = this.gl.createTexture();

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._buffer);
        this.gl.activeTexture(this.gl.TEXTURE0);

        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texStorage2D(this.gl.TEXTURE_2D, 1, component, width, height);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachment, this.gl.TEXTURE_2D, texture, 0);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this._types[name].texture = texture;
    }
}