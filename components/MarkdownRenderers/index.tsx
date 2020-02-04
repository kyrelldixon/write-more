import HeadingRenderer from './HeadingRenderer'
import ListRenderer from './ListRenderer'
import LinkRenderer from './LinkRenderer'
import ParagraphRenderer from './ParagraphRender'
import HorizontalRuleRenderer from './HorizontalRuleRenderer'

export default {
  heading: HeadingRenderer,
  list: ListRenderer,
  paragraph: ParagraphRenderer,
  link: LinkRenderer,
  thematicBreak: HorizontalRuleRenderer,
}