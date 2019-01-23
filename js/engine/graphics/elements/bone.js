import Vector3 from '../../../math/vector3.js';
import Renderable from '../renderable.js';
import { Matrix4 } from '../../../math/exports.js';

const v = `#version 300 es
    precision mediump float;
    
    in vec3 vertex;
    in vec3 normal;
    
    uniform mat4 world;
    
    uniform camera{
        mat4 view;
        mat4 projection;
    };
    
    out vec3 v_normal;
    
    void main(void) {           
        v_normal = (world * vec4(normal, 1.0)).xyz;
        
        gl_Position = projection * view * world * vec4(vertex, 1.0);
    }
`;
const f = `#version 300 es
    precision mediump float;
    
    in vec3 v_normal;
    
    const vec3 baseColor = vec3(.8, .5, .8);
    
    uniform lighting{
        vec3 position;
        vec3 color;
    } light;
                
    out vec4 color;
    
    void main(void) {
        float diffAngle = max(dot(v_normal, normalize(light.position - v_normal)), 0.0);
        color = vec4(baseColor + light.color * diffAngle, 1.0);
    }
`;

export default class Bone extends Renderable
{
    constructor(renderer, length)
    {
        super(renderer, v, f, [
              0,   0,   0,     0, -1,  0,
             .1, .25,  .1,     0,  0, -1,
            -.1, .25,  .1,     0, -1,  0,
            -.1, .25, -.1,     0,  0,  1,
             .1, .25, -.1,     0,  1,  0,
              0,   1,   0,     0,  1,  0,
        ], [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 1,

            5, 1, 4,
            5, 4, 3,
            5, 3, 2,
            5, 2, 1,
        ]);

        this.world = Matrix4.identity;
        this._length = length;
    }

    get length()
    {
        return this._length;
    }

    get world()
    {
        return this._world;
    }

    set world(m)
    {
        m = m.scale(new Vector3(this._length / 2, this._length, this._length / 2));

        this._world = m;
        this.program.world = m.points;
    }
}
