class BahanList extends HTMLElement{
    connectedCallback(){
        this.bahan = this.getAttribute('bahan') || [];
        this.bahan = this.bahan.split(',');
        this.render()
    }

    render(){
        this.innerHTML = '';

        this.bahan.forEach(item => {
            this.innerHTML += `<li>${item}</li>`
        })
    }
}

customElements.define('bahan-list', BahanList);