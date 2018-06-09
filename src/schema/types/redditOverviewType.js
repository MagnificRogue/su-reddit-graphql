var {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLUnionType
} = require('graphql');


const redditCommentType = require('./Comment');
const redditLinkType = require('./Link');

const resolveType = (data) => {
	if (data.body){
		return redditCommentType;
	}else{
		return redditLinkType;
	}
};

const redditOverviewType = module.exports = new GraphQLUnionType({
	name: 'redditOverview',
	description: `comment | link`,
	types: [redditCommentType, redditLinkType],
	resolveType: resolveType
});
