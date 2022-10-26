//const {projects, clients} = require('../sampleData')

// Mongoose models

const Project = require('../models/Projects')
const Client = require('../models/Clients')


const {GraphQLObjectType,
     GraphQLID, 
     GraphQLString,
      GraphQLSchema,
      GraphQLList,
      GraphQLNonNUll,
      GraphQLEnumType
    }= require('graphql')

// Client 

const ClinetType = new GraphQLObjectType({
    name: 'Client',
    fields: ()=>({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        email: { type: GraphQLString},
        phone: { type: GraphQLString},
    }),
})

// projects 

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: ()=>({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        description: { type: GraphQLString},
        status: { type: GraphQLString},
        client:{
            type: ClinetType,
            resolve(parent, args){
                return Client.findById(parent.clientId)
            }
        }
    }),
})

const RootQuery = new GraphQLObjectType({
    name:  'RootQueryType',
    fields:{
        clients: {
            type: new GraphQLList(ClinetType),
            resolve(parent, args){
                return Client.find()
            }
        },
        client:{
            type: ClinetType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Client.findById(args.id)
            },
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args){
                return Project.find()
            }
        },
        project:{
            type: ProjectType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Project.findById(args.id)
            },
        },
    },
})

// Mutations

const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields:{
        // Add Client
        addClient:{
            type: ClinetType,
            args:{
                name:{type: GraphQLString},
                email:{type: GraphQLString},
                phone:{type: GraphQLString},
            },
            resolve(parent ,args){
                const client= new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                return client.save()
            }
        },
        //Delete Client
        deleteClient:{
            type: ClinetType,
            args:{
                id:{ type: GraphQLID}
            },
            resolve(parent, args){
                return Client.findByIdAndRemove(args.id)
            }
        },
        // Add project
        addProject:{
            type: ProjectType,
            args:{
                name: {type: GraphQLString},
                description: {type: GraphQLString},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'},
                        }
                    }),
                    defaultValue: 'Not Started'
            },
            clientId: {
                type: GraphQLID
            }
        },
            resolve(parent, args){
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                })
                return project.save()
            }
            
        },
        // Delete project
        deleteProject:{
            type: ProjectType,
            args:{
                id:{ type: GraphQLID}
            },
            resolve(parent, arg)
            {
                return Project.findByIdAndRemove(arg.id)
            }
        },
        // update Project
        updateProject:{
            type: ProjectType,
            args:{
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                description: {type: GraphQLString},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'},
                        }
                    }),
            },
            },
            resolve(parent, args){
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            name:args.name,
                            description: args.description,
                            status: args.status
                        }
                    },{ now: true}
                )
            }

        }
    }

})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})