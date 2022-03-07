class SearchBar extends HTMLElement{

    connectedCallback(){
        this.placeholder = this.getAttribute('placeholder') || null;
        this.title = this.getAttribute('title') || '';
        this.icon = this.getAttribute('icon') || null;
        this.render()
    }

    render(){
        this.innerHTML = `
            <form>
                <input type="search" id="cari" placeholder="${this.placeholder}" />
                <button>
                    <i class="${this.icon}"></i>
                    ${this.title}
                </button>
            </form>
        `;
    }
}

customElements.define('search-bar', SearchBar);