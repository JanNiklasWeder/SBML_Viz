function load_sbml(data) {
    var parser = new DOMParser();
    console.log(parser);
    var sbml = parser.parseFromString(data,"text/xml");
    console.log(sbml);
    console.log(typeof sbml);

    var result_nodes = []
    var result_links = []

    var metabolites = []

    var items = sbml.querySelector("listOfSpecies").children;
    var n_metabolites = items.length
    for (var i = 0; i< n_metabolites; i++ ) {
        var metabolite_dom = items[i];
        var metabolite = new Metabolite(metabolite_dom.id);

        var item = {
            "id": metabolite_dom.id,
            "group": 1,
            "links": [],
        }

        metabolites.push(metabolite);
        result_nodes.push(item);
    }

    var reactions = []

    var items = sbml.querySelector("listOfReactions").children;
    var n_reactions = items.length
    for (var i = 0; i< n_reactions; i++ ) {
        var reaction_dom = items[i];
        var reaction = new Reaction(reaction_dom.id);

        var item = {
            "id": reaction_dom.id,
            "group": 2,
            "links": [],
        }

        var length = reaction_dom.getElementsByTagName("listOfReactants").length
        var before = result_links.length
        if (reaction_dom.getElementsByTagName("listOfReactants").length > 0 ) {
            for (var speciesReference of reaction_dom.getElementsByTagName("listOfReactants")[0].children) {

                var link = {
                    "id" : speciesReference.getAttribute("species") + "-" + reaction_dom.id,
                    "source" : speciesReference.getAttribute("species"),
                    "target" : reaction_dom.id,
                    "value": speciesReference.getAttribute("stoichiometry")
                }

                var metabolite = result_nodes.find(x => x.id === speciesReference.getAttribute("species"))

                var link_id = speciesReference.getAttribute("species") + "-" + reaction_dom.id
                metabolite.links.push(link_id)
                item.links.push(link_id)

                result_links.push(link)
    
            }
        } else {
            console.log("Empty 1")
            console.log(reaction_dom.getElementsByTagName("listOfReactants"))
        }



        if (reaction_dom.getElementsByTagName("listOfProducts").length > 0) {
            for (var speciesReference of reaction_dom.getElementsByTagName("listOfProducts")[0].children) {
                var link = {
                    "id" : reaction_dom.id +"-"+ speciesReference.getAttribute("species"),
                    "target" : speciesReference.getAttribute("species"),
                    "source" : reaction_dom.id,
                    "value": speciesReference.getAttribute("stoichiometry")
                }

                var metabolite = result_nodes.find(x => x.id === speciesReference.getAttribute("species"))
                var link_id = reaction_dom.id +"-"+ speciesReference.getAttribute("species")

                metabolite.links.push(link_id)
                item.links.push(link_id)
    
                result_links.push(link)
            }
        }else {
            console.log("Empty 2")
            console.log(reaction_dom.getElementsByTagName("listOfProducts"))
        }

        
        reactions.push(reaction);
        result_nodes.push(item);
    }

    var result = {
        "nodes" : result_nodes,
        "links": result_links,
    }

    return (result);
    }

function load_flux_from_csv(csv) {
    var data = csv.split(/(\r\n|\n|\r)/gm);
    var result = [];
    for (var i = 1; i < data.length; i++) {
        if (data[i].length > 1) {
            var elementArray = data[i].split(",");
            result["R_" + elementArray[0]] = elementArray[1]
        } 
    } 

    return result
}



class Metabolite{
    constructor(id, group) {
        this.id = id;
        this.group = group;
    }
}


class Reaction{
    constructor(id, source, target) {
        this.id = id;
        this.source = source,
        this.target = target
    }
}


export {load_sbml, load_flux_from_csv, Metabolite, Reaction};