import axios from 'axios';
import { jsPDF } from 'jspdf';

import './components/nav-bar.js';
import './components/bahan-list.js';
import './components/search-bar.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style/style.css';

const formElement = document.querySelector('form');
const mainElement = document.querySelector('.main');
const selectBahan = document.querySelector('#select-bahan');
const selectKategori = document.querySelector('#select-kategori');
const selectArea = document.querySelector('#select-area');
const clearBtn = document.querySelector('.clear');
const randomBtn = document.querySelector('.random');

const convertToPDF = meal => {
    const ingredients = Object.entries(meal).filter(([key, value]) => {
        return key.includes('Ingredient')
    }).map(([key, value]) => {
        return value
    });

    const measures = Object.entries(meal).filter(([key, value]) => {
        return key.includes('Measure')
    }).map(([key, value]) => {
        return value
    });

    const newIngredients = [];
    const newMeasures = [];

    ingredients.forEach(item => {
        if(item){
            newIngredients.push(item)
        }
    })
    measures.forEach(item => {
        if(item){
            newMeasures.push(item)
        }
    })

    const imgData = meal.strMealThumb;
    const doc = new jsPDF();

    doc.setFontSize(40);
    doc.text(35, 25, meal.strMeal);
    doc.addImage(imgData, 'JPEG', 15,40, 180, 160);

    
    let baris = 20
    doc.addPage();
    doc.setFontSize(18);
    doc.text(20,baris, 'Bahan-bahan');

    doc.setFontSize(8);
    let no = 1;
    newIngredients.forEach((ingredient, index) => {
        baris += 10;
        doc.text(30,baris, `${no}. ${newMeasures[index]} ${ingredient}`);
        no += 1;
    })

    // doc.addPage();
    // doc.setFontSize(18);
    // doc.text(20, 20, 'Instruksi');

    // doc.setFontSize(8);
    // doc.text(10, 30, "" + meal.strInstructions)

    doc.save(`${meal.strMeal}.pdf`);
}

const createDescriptionElement = meal => {
    mainElement.innerHTML = '';

    const ingredients = Object.entries(meal).filter(([key, value]) => {
        return key.includes('Ingredient')
    }).map(([key, value]) => {
        return value
    });

    const measures = Object.entries(meal).filter(([key, value]) => {
        return key.includes('Measure')
    }).map(([key, value]) => {
        return value
    });

    const newIngredients = [];
    const newMeasures = [];

    ingredients.forEach(item => {
        if(item){
            newIngredients.push(item)
        }
    })
    measures.forEach(item => {
        if(item){
            newMeasures.push(item)
        }
    })

    const printBtn = document.createElement('button');
    printBtn.setAttribute('class', 'btn btn-warning me-2');
    printBtn.innerText = 'Download PDF';
    printBtn.addEventListener('click', _ => {
        convertToPDF(meal)
    })

    const watchBtn = document.createElement('a');
    watchBtn.setAttribute('class', 'btn btn-danger')
    watchBtn.setAttribute('href', meal.strYoutube);
    watchBtn.setAttribute('target', '_blank');
    watchBtn.innerText = 'Watch!';

    const colElement = document.createElement('div');
    colElement.setAttribute('class', 'col-12');
    colElement.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" />
        <h4>Bahan-bahan</h4>
        <hr/>
        <ol>
            <bahan-list bahan="${newIngredients}"></bahan-list>
        </ol>
        <h4>Instruksi</h4>
        <hr/>
        <pre>${meal.strInstructions}</pre>
        <div class="d-flex my-3"></div>
    `;
    const btnsDiv = colElement.childNodes[17];
    btnsDiv.appendChild(printBtn);
    btnsDiv.appendChild(watchBtn);

    mainElement.appendChild(colElement);
}

const getMealsById = async mealId => {
    try {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const meal = res.data.meals;
        meal.map(item => {
            createDescriptionElement(item);
        })
    } catch (error) {
        console.log('ERROR NIH CUY =>', error);
    }
}

const createNewElement = (mealId, title, src) => {
    const colElement = document.createElement('div');
    const figcaptionElement = document.createElement('figcaption');
    const figureElement = document.createElement('figure');
    const detailBtn = document.createElement('button');

    detailBtn.innerText = 'Detail';
    detailBtn.setAttribute('class', 'btn btn-light')
    detailBtn.addEventListener('click', _ => {
        getMealsById(mealId);
    })

    figcaptionElement.innerHTML = `<h3>${title}</h3>`;
    figcaptionElement.appendChild(detailBtn);

    figureElement.innerHTML = `<img style="max-width: 100%; height: auto;" src="${src}" alt="${title}">`;
    figureElement.appendChild(figcaptionElement);

    colElement.setAttribute('class', 'col-md-4 col-6');
    colElement.appendChild(figureElement);
            
    mainElement.appendChild(colElement);
}
        
const getMeals = async searchQuery => {
    mainElement.innerHTML = '';
    try {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
        const meals = res.data.meals;
        meals.map(meal => {
            createNewElement(meal.idMeal,meal.strMeal, meal.strMealThumb)
        })
    } catch (error) {
        console.log('ERROR =>', error)
    }
}

const getMealsByIngredients = async ingredient => {
    mainElement.innerHTML = '';
    try {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const meals = res.data.meals;

        meals.map(item => {
            createNewElement(item.idMeal, item.strMeal, item.strMealThumb)
        })
    } catch (error) {
        console.log('ERROR NIH CUY =>', error);
    }
}

const getIngredients = async _ => {
    try {
        const res = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        const data = res.data.meals;
        
        data.forEach(ingredient => {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', ingredient.strIngredient)
            optionElement.innerText = ingredient.strIngredient;
            selectBahan.appendChild(optionElement)
        })
    } catch (error) {
        console.log(error);
        alert('Periksa kembali internet anda!')
    }
}

const getMealsByCategory = async category => {
    mainElement.innerHTML = '';
    try {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const meals = res.data.meals;

        meals.map(item => {
            createNewElement(item.idMeal, item.strMeal, item.strMealThumb)
        })
    } catch (error) {
        console.log('ERROR NIH CUY =>', error);
    }
}

const getCategory = async _ => {
    try {
        const res = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const data = res.data.meals;

        
        data.forEach(category => {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', category.strCategory)
            optionElement.innerText = category.strCategory;
            selectKategori.appendChild(optionElement)
        })
    } catch (error) {
        console.log(error);
        alert('Periksa kembali internet anda!')
    }
}

const getMealsByArea = async area => {
    mainElement.innerHTML = '';
    try {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const meals = res.data.meals;

        meals.map(item => {
            createNewElement(item.idMeal, item.strMeal, item.strMealThumb)
        })
    } catch (error) {
        console.log('ERROR NIH CUY =>', error);
    }
}

const getArea = async _ => {
    try {
        const res = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        const data = res.data.meals;
        data.forEach(area => {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', area.strArea);
            optionElement.innerText = area.strArea;
            selectArea.appendChild(optionElement);
        })
    } catch (error) {
        console.log(error);
        alert('Periksa kembali internet anda!');
    }
}

const getRandomMeal = async _ => {
    try {
        const res = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
        const meal = res.data.meals;
        meal.map(item => {
            createDescriptionElement(item)
        })
    } catch (error) {
        console.log(error)
    }
}

clearBtn.addEventListener('click', e => {
    mainElement.innerHTML = '';
});

randomBtn.addEventListener('click', _ => {
    getRandomMeal();
})

formElement.addEventListener('submit', e => {
    e.preventDefault();
    const cari = document.getElementById('cari');
    if(cari.value.length < 1){
        alert('Masukan Resep yang Ingin di Cari!')
    }else{
        getMeals(cari.value);
        cari.value = null;
    }
});

selectKategori.addEventListener('change', e => {
    getMealsByCategory(e.target.value)
});

selectArea.addEventListener('change', e => {
    getMealsByArea(e.target.value);
})

selectBahan.addEventListener('change', e => {
    getMealsByIngredients(e.target.value);
})

document.addEventListener('DOMContentLoaded', _ => {
    getIngredients();
    getCategory();
    getArea();
})