
function clickNode(html_node, Graph) {
      var node_id = html_node.innerText
      let {nodes, links } = Graph.graphData();
      var node = nodes.find(n => n.id == node_id);

      const distance = 40;
      const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

      const newPos = node.x || node.y || node.z
        ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
        : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

      Graph.cameraPosition(
        newPos, // new position
        node, // lookAt ({ x, y, z })
        3000  // ms transition duration
      );
    }




export {clickNode};