import HeadingRenderer from './HeadingRenderer'
import ListRenderer from './ListRenderer'
import LinkRenderer from './LinkRenderer'
import ParagraphRenderer from './ParagraphRender'
import HorizontalRuleRenderer from './HorizontalRuleRenderer'
import BlockQuoteRenderer from './BlockQuoteRenderer'
import InlineCodeRenderer from './InlineCodeRenderer'

export default {
  heading: HeadingRenderer,
  list: ListRenderer,
  paragraph: ParagraphRenderer,
  link: LinkRenderer,
  thematicBreak: HorizontalRuleRenderer,
  blockquote: BlockQuoteRenderer,
  inlineCode: InlineCodeRenderer,
}