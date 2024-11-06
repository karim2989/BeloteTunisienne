class TableRenderer {
    private static docEles = new Map<string,Element>
    public static player0: Element;
    public static player1: Element;
    public static player2: Element;
    public static player3: Element;

    public static Init() {
        this.docEles.set('player0',document.getElementsByClassName("player0hand").item(0))
        this.docEles.set('player1',document.getElementsByClassName("player1hand").item(0))
        this.docEles.set('player2',document.getElementsByClassName("player2hand").item(0))
        this.docEles.set('player3',document.getElementsByClassName("player3hand").item(0))
    }

    public static RenderPlayer0Hand(username: string, hand: string){
        return this.renderhand(username,hand,'player0')
    }
    public static RenderPlayer1Hand(username: string, hand: string){
        return this.renderhand(username,hand,'player1')
    }
    public static RenderPlayer2Hand(username: string, hand: string){
        return this.renderhand(username,hand,'player2')
    }
    public static RenderPlayer3Hand(username: string, hand: string){
        return this.renderhand(username,hand,'player3')
    }
    private static renderhand(username: string, hand: string,elementname :string): void {
        (this.docEles.get(elementname).getElementsByTagName('p').item(0)).innerHTML = username
        let deck = this.docEles.get(elementname).getElementsByClassName('deck').item(0)
        while (deck?.firstChild) {
            deck.removeChild(deck.firstChild)
        }
        if (deck)
            this.appendCardsToDeckElement(deck, hand, elementname == 'player0')
        else throw console.trace()
    }
    private static appendCardsToDeckElement(deck: Element, cards: string, isplayer: boolean = false): void {
        cards.split(" ").forEach(e => {
            let img = document.createElement("img")
            img.src = AssetManager.Get(e);
            img.draggable = false
            img.classList.add("card")
            if (isplayer) {
                img.classList.add("draggable")
                img.classList.add("zoomable")
            }
            deck?.appendChild(img)
        })
    }
}