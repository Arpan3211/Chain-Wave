import { NodeProps } from "@xyflow/react";
import NodeCard from "./NodeCard";
import { memo } from "react";


const NodeComponent = memo((props:NodeProps)=>{
    return <NodeCard nodeId={props.id}>
        AppNode
    </NodeCard>;
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";