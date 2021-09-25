import * as MarkdownIt from "markdown-it"
import { unpackAttributes, buildRender, ElementType, ContainerType } from './contentScriptUtils'

const fenceNameRegExp = /jira-?issue/
const htmlTagRegExpMulti = /<jiraissue +(?<attributes>[^>]+?) *\/?>/g
const htmlTagRegExp = /<jiraissue +(?<attributes>[^>]+?) *\/?>/

export default function (context) {
    return {
        plugin: function (markdownIt: MarkdownIt, _options) {
            markdownIt.renderer.rules.fence = buildRender(
                markdownIt.renderer.rules.fence,
                context.contentScriptId,
                ElementType.Issue,
                ContainerType.Block,
                t => fenceNameRegExp.test(t.info.toLowerCase()),
                t => t.content
            )
            markdownIt.renderer.rules.html_inline = buildRender(
                markdownIt.renderer.rules.html_inline,
                context.contentScriptId,
                ElementType.Issue,
                ContainerType.Inline,
                t => htmlTagRegExp.test(t.content.toLowerCase()),
                t => t.content.toLowerCase().match(htmlTagRegExpMulti).map(m => unpackAttributes(m.match(htmlTagRegExp).groups.attributes).key).join('\n')
            )
            markdownIt.renderer.rules.html_block = buildRender(
                markdownIt.renderer.rules.html_block,
                context.contentScriptId,
                ElementType.Issue,
                ContainerType.Inline,
                t => htmlTagRegExp.test(t.content.toLowerCase()),
                t => t.content.toLowerCase().match(htmlTagRegExpMulti).map(m => unpackAttributes(m.match(htmlTagRegExp).groups.attributes).key).join('\n')
            )
        },
        assets: function () {
            return [
                { name: 'style.css' },
            ]
        },
    }
}