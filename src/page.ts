import {
    ButtonStyle,
    ButtonBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    Colors,
} from "discord.js";
class Page {
    /**
     * Title of the page. Will default to embed title if not given
     */
    title?: string;
    /**
     * Content of the page.
     */
    _content: string;
    /**
     * Color of the embed's page.
     */
    color?: number;
    embed: EmbedBuilder;

    constructor(o: { title?: string; content: string; color?: number }) {
        this.title = o.title !== undefined ? o.title : "title";
        this.content = o.content;
        this.color = o.color !== undefined ? o.color : Colors.Blue;
    }

    set content(i: string) {
        this._content = i;
        this.embed = new EmbedBuilder()
            .setTitle(this.title)
            .setDescription(this._content);
        if (this.color !== undefined) this.embed.setColor(this.color);
    }

    get content() {
        return this._content;
    }
}

interface PagerButton {
    /**
     * Do not add this property. Pager does this for you.
     */
    customId: string;
    style?: ButtonStyle;
    label?: string;
    emoji?: string;
    /**
     * Do not add this property either. Pager does this for you.
     */
    disabled: boolean;
}

/**
 * 1 Array of strings, 2 Array of objects. 0 none.
 * @param arr
 * @returns
 */
const type = (arr: any[]): 0 | 1 | 2 =>
    Array.isArray(arr) && arr.length > 0
        ? arr.every((item) => typeof item === "object" && item !== null)
            ? 2
            : arr.every((item) => typeof item === "string")
            ? 1
            : 0
        : 0;
export class Pager {
    constructor(title?: string) {
        this.defaultTitle = title !== undefined ? title : "Pages";
    }
    private defaultTitle: string;
    /**
     * Array of pages. to access a page just use Pager.pages[index]
     */
    pages: Page[] = [];
    index: number = 0;
    private _ids = {
        nextPage: "nextPage",
        prevPage: "prevPage",
        nextMaxPage: "nextMaxPage",
        prevMaxPage: "prevMaxPage",
    };
    private buttons: {
        nextPage: PagerButton;
        prevPage: PagerButton;
        nextMaxPage: PagerButton;
        prevMaxPage: PagerButton;
    } = {
        prevMaxPage: {
            customId: this._ids.prevMaxPage,
            label: "<<",
            style: ButtonStyle.Success,
            disabled: true,
        },
        prevPage: {
            customId: this._ids.prevPage,
            label: "<",
            style: ButtonStyle.Success,
            disabled: true,
        },
        nextPage: {
            customId: this._ids.nextPage,
            label: ">",
            style: ButtonStyle.Success,
            disabled: false,
        },
        nextMaxPage: {
            customId: this._ids.nextMaxPage,
            label: ">>",
            style: ButtonStyle.Success,
            disabled: false,
        },
    };

    /**
     * Customize the buttons used to page.
     * @param i Object defining button properties.
     */
    config(i: {
        /**
         * Button which goes to the next page
         */
        nextPage?: PagerButton;
        /**
         * Button which goes to the previous page.
         */
        prevPage?: PagerButton;
        /**
         * Button which skips to the last page
         */
        nextMaxPage?: PagerButton;
        /**
         * Button which skips to the first page
         */
        prevMaxPage?: PagerButton;
    }): void {
        const updateButton = (
            buttonType: "prevPage" | "nextPage" | "nextMaxPage" | "prevMaxPage",
            input: {
                [key: string]: PagerButton;
            }
        ) => {
            if (i[buttonType]) {
                this.buttons[buttonType].emoji =
                    input[buttonType]?.emoji !== undefined
                        ? input[buttonType].emoji
                        : this.buttons[buttonType].emoji;
                this.buttons[buttonType].label =
                    input[buttonType]?.label !== undefined
                        ? input[buttonType].label
                        : this.buttons[buttonType].label;
                this.buttons[buttonType].style =
                    input[buttonType]?.style !== undefined
                        ? input[buttonType].style
                        : this.buttons[buttonType].style;
            }
        };
        updateButton("prevPage", i);
        updateButton("nextPage", i);
        updateButton("nextMaxPage", i);
        updateButton("prevMaxPage", i);
    }

    /**
     * Add a page
     * @param T Object with properties: string and content.
     */
    addPage(T: Page): void;
    /**
     * Add a page
     * @param T String that represents the content of the page.
     */
    addPage(T: string): void;

    addPage(T: Page | string): void {
        if (typeof T === "string") {
            let page = new Page({ title: this.defaultTitle, content: T });
            this.pages.push(page);
        } else {
            this.pages.push(
                new Page({
                    title: T.title || this.defaultTitle,
                    content: T.content,
                })
            );
        }
    }

    /**
     * Add a pages
     * @param T Object with properties: string and content.
     */
    addPages(...T: Page[]): void;
    /**
     * Add a page
     * @param T String that represents the content of the page.
     */
    addPages(...T: string[]): void;

    addPages(...T: Page[] | string[]): void {
        if (type(T) === 1) {
            for (const content of T as string[]) {
                this.pages.push(
                    new Page({ title: this.defaultTitle, content: content })
                );
            }
        } else {
            let pages: Page[];
            for (const page of T as Page[]) {
                this.pages.push(
                    new Page({
                        title: page.title || this.defaultTitle,
                        content: page.content,
                    })
                );
            }
        }
    }

    /**
     * Remove a page by it's index
     * @param index Page Index
     */
    removePage(index: number) {
        this.pages.splice(index, 1);
    }

    /**
     * Turn a long array of strings into pages.
     * @param array Array of strings.
     * @param maxContentPerPage Max amount of content a page can have (If you seprate using \n then think of this as max amount of lines)
     * @param separator What to seprate the array contents by. Defaults to a line break.
     */
    addDynamicPages(
        array: string[],
        maxContentPerPage: number,
        separator?: string
    ): void {
        separator = separator !== undefined ? separator : "\n";
        for (let i = 0; i < array.length; i += maxContentPerPage) {
            const slicedArray = array.slice(i, i + maxContentPerPage);
            const content = slicedArray.join(separator);
            this.addPage(new Page({ title: this.defaultTitle, content }));
        }
    }

    private async changeButtons() {
        if (this.index == 0) {
            this.buttons.prevMaxPage.disabled = true;
            this.buttons.prevPage.disabled = true;
        } else {
            this.buttons.prevMaxPage.disabled = false;
            this.buttons.prevPage.disabled = false;
        }

        if (this.index + 1 == this.pages.length) {
            this.buttons.nextMaxPage.disabled = true;
            this.buttons.nextPage.disabled = true;
        } else {
            this.buttons.nextMaxPage.disabled = false;
            this.buttons.nextPage.disabled = false;
        }
    }

    private async buildButtons(): Promise<ActionRowBuilder> {
        await this.changeButtons();
        let buttons: ButtonBuilder[] = [];
        const iterate = Object.values(this.buttons);
        for (const button of iterate) {
            let a = new ButtonBuilder()
                .setCustomId(button.customId)
                .setLabel(button.label)
                .setStyle(button.style)
                .setDisabled(button.disabled);

            if (button.emoji !== undefined) a.setEmoji(button.emoji);
            buttons.push(a);
        }
        return new ActionRowBuilder().addComponents(...buttons);
    }

    /**
     * Displays current page. And if given a customId (one of the buttons) will change depending on it.
     * @param customId Button's customId
     * @returns
     */
    async currentPage(customId?: string) {
        switch (customId) {
            case this._ids.prevMaxPage:
                this.index = 0;
                break;
            case this._ids.prevPage:
                this.index--;
                break;
            case this._ids.nextPage:
                this.index++;
                break;
            case this._ids.nextMaxPage:
                this.index = this.pages.length - 1;
                break;
            default:
                break;
        }
        let c = await this.buildButtons();

        return {
            /**
             * Embed made by the code
             */
            embed: this.pages[this.index].embed,
            /**
             * The raw page if you'd like to make the embed yourself
             */
            raw: {
                /**
                 * The page's contents
                 */
                content: this.pages[this.index].content,
                /**
                 * The page's title
                 */
                title: this.pages[this.index].title,
            },
            /**
             * The array of components in which your buttons are stored.
             */
            components: [c],
        };
    }
}
