class NavBar extends HTMLElement{
    constructor(){
        super();
        this.shadowDom = this.attachShadow({mode:"open"});
    }

    connectedCallback(){
        this.title = this.getAttribute('title') || null;
        this.src = this.getAttribute('src') || "https://i.pinimg.com/736x/13/8f/29/138f29274da760ecf9c2e3f488ee1d42.jpg";
        this.render()
    }

    render(){
        this.shadowDom.innerHTML = `
            <style>
                nav{
                    display:flex;
                    align-items: center;
                    padding: 12px 16px;
                
                    background-color: darkred;
                    color: white;
                }
                img{
                    margin-right: 5px;
                    width: 50px;
                }
            </style>
            <nav>
                <img src="${this.src}" alt="${this.title}" />
                <h2>${this.title}</h2>
            </nav>
        `;
    }
}

customElements.define('nav-bar', NavBar);