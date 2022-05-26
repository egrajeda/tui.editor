import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { getWwCommands } from '@/commands/wwCommands';
import {
  createDOMInfoParsedRawHTML,
  getCustomAttrs,
  getDefaultCustomAttrs,
} from '@/wysiwyg/helper/node';
import { changeListTo, toggleListToTask, toggleTask } from '@/wysiwyg/command/list';

import { Command } from 'prosemirror-commands';

export class BulletList extends NodeSchema {
  get name() {
    return 'bulletList';
  }

  get schema() {
    return {
      content: 'listItem+',
      group: 'block',
      attrs: {
        rawHTML: { default: null },
        ...getDefaultCustomAttrs(),
      },
      parseDOM: [createDOMInfoParsedRawHTML('ul')],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return ['ul', getCustomAttrs(attrs), 0];
      },
    };
  }

  private toBulletList(): Command {
    return (state, dispatch) => changeListTo(state.schema.nodes.bulletList)(state, dispatch);
  }

  private toggleTaskList(): Command {
    return toggleListToTask();
  }

  private toggleTask(): Command {
    return toggleTask();
  }

  commands() {
    return {
      bulletList: this.toBulletList,
      taskList: toggleListToTask,
    };
  }

  keymaps() {
    const bulletListCommand = this.toBulletList();
    const taskListCommand = this.toggleTaskList();
    const { indent, outdent } = getWwCommands();
    const toggleTaskCommand = this.toggleTask();

    return {
      'Mod-u': bulletListCommand,
      'Mod-U': bulletListCommand,
      'alt-t': taskListCommand,
      'alt-T': taskListCommand,
      Tab: indent(),
      'Shift-Tab': outdent(),
      'Shift-Ctrl-x': toggleTaskCommand,
      'Shift-Ctrl-X': toggleTaskCommand,
    };
  }
}
