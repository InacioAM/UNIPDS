import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js';
import { workerEvents } from '../events/constants.js';

console.log('Model training worker initialized');
let _globalCtx = {};

//Normaliza os valores de idade e preço para o intervalo [0, 1] para facilitar o treinamento do modelo.
//Formula para nomalização: (value - min) / (max - min)
//Exemplo: min = 18, max = 65, value = 30 então -> (30 - 18) / (65 - 18) = 0.25

const normalize = (value, min, max) => (value - min) / ((max - min) || 1)

function makeContext(catalog, users) {
    const ages = users.map(u => u.age)
    const prices = catalog.map(p => p.price)

    const minAge = Math.min(...ages)
    const maxAge = Math.max(...ages)

    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)   
    
    const colors = [...new Set(catalog.map(p => p.color))]
    const categories = [...new Set(catalog.map(p => p.category))]
    
    const colorIndex = Object.entries(
        colors.map((color,index) => {
            return [color, index]
        }))
    
    const categoriesIndex = Object.entries(
        categories.map((category,index)=> {
            return [category, index]
        }))

    //Computar a média de idade dos comprados por produto
    //(Ajuda na personalização)

    const midAge = (minAge + maxAge) / 2
    const ageSums = {}
    const ageCounts = {}

    users.forEach(user => {
        user.purchases.forEach(p =>{
            ageSums[p.name] = (ageSums[p.name] || 0) + user.age
            ageCounts[p.name] = (ageCounts[p.name] || 0) + 1
        })
    })

    const productAvgAgeNorm = Object.fromEntries(
        catalog.map(product => {
            const avg = ageCounts[product.name] ?
                ageSums[product.name] / ageCounts[product.name] :
                midAge

                return [product.name, normalize(avg, minAge, maxAge)];
        })
    )

    return {
        catalog,
        users,
        colorIndex,
        categoriesIndex,
        minAge,
        maxAge,
        minPrice,
        maxPrice,
        numCatagories: categories.length,
        numColors: colors.length,
        dimensions: 2 + categories.length + colors.length, // idade, preço + one-hot para categorias e cores
    }
    
}

async function trainModel({ users }) {
    console.log('Training model with users:', users)
    postMessage({ type: workerEvents.progressUpdate, progress: { progress: 50 } });
    const catalog = await(await fetch('/data/products.json')).json();

    const context = makeContext(catalog, users);
    postMessage({
        type: workerEvents.trainingLog,
        epoch: 1,
        loss: 1,
        accuracy: 1
    });

    setTimeout(() => {
        postMessage({ type: workerEvents.progressUpdate, progress: { progress: 100 } });
        postMessage({ type: workerEvents.trainingComplete });
    }, 1000);


}
function recommend(user, ctx) {
    console.log('will recommend for user:', user)
    // postMessage({
    //     type: workerEvents.recommend,
    //     user,
    //     recommendations: []
    // });
}


const handlers = {
    [workerEvents.trainModel]: trainModel,
    [workerEvents.recommend]: d => recommend(d.user, _globalCtx),
};

self.onmessage = e => {
    const { action, ...data } = e.data;
    if (handlers[action]) handlers[action](data);
};
