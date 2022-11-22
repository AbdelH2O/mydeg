import React, { FC, memo } from 'react';
import { Handle, NodeProps, Position, WrapNodeProps } from 'reactflow';
import { CustomNode } from '../types';

const CourseNode: FC<NodeProps> = ({ data, dragHandle }) => {
  return (
    <div className='px-4 py-2 border-2 border-black custom-drag-handle' style={{boxShadow: '-3px 5px #000', backgroundColor: data.background}}>
      
      <div className='text-white font-JetBrainsMono bg-black px-1 rounded'>
        {data.code}
      </div>
      {/* <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} /> */}
      {/* style={{ backgroundColor: 'white', height: '1px!important', width: '0.01px!important', border: '0.01px solid black', zIndex: -10 }} */}
      <Handle
        type='target'
        position={Position.Right}
        id={data.code + "tarRight"}
        // style={{ display: 'none' }}
        style={{ height: '0.01px!important', width: '0.01px!important', border: '1px solid black', zIndex: -10 }}
      />
      <Handle
        type='source'
        position={Position.Right}
        id={data.code + "right"}
        // style={{ display: 'none' }}
        style={{ height: '0.01px!important', width: '0.01px!important', border: '1px solid black', zIndex: -10 }}
        />
      <Handle
        type='target'
        position={Position.Left}
        id={data.code + "tarLeft"}
        // style={{ display: 'none' }}
        style={{ backgroundColor: 'white', height: '0.01px!important', width: '0.01px!important', border: '1px solid black', zIndex: -10 }}
        />
      <Handle
        type='source'
        position={Position.Left}
        id={data.code + "left"}
        // style={{ display: 'none' }}
        style={{ backgroundColor: 'white', height: '0.01px!important', width: '0.01px!important', border: '1px solid black', zIndex: -10 }}
        />
      <Handle
        type='target'
        position={Position.Top}
        id={data.code + "tarTop"}
        // style={{ display: 'none' }}
        style={{ backgroundColor: 'white', height: '0.01px!important', width: '0.01px!important', border: '1px solid black', zIndex: -10 }}
        />
      <Handle
        type='source'
        position={Position.Top}
        id={data.code + "top"}
        className="bg-blue-100"
        // style={{ display: 'none' }}
        style={{ height: '0.01px!important', width: '0.01px!important', border: '1px solid black', zIndex: -10 }}
        />
      <Handle
        type='target'
        position={Position.Bottom}
        id={data.code + "tarBottom"}
        style={{ backgroundColor: 'white', height: '0.01px!important', width: '0.01px!important', border: '1px solid black', zIndex: -10 }}
        // style={{ backgroundColor: 'white', height: '0.01px!important', width: '0.01px!important' }}
        />
      <Handle
        type='source'
        position={Position.Bottom}
        id={data.code + "bottom"}
        style={{ backgroundColor: 'white', height: '0.01px!important', width: '0.01px!important', border: '1px solid black', zIndex: -10 }}
      />
    </div>
  );
};

export default memo(CourseNode);