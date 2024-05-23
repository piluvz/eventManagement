const Categories = require('./Categories')

const data = [
    'Кино',
    'Театры',
    'Концерты',
    'Спорт',
    'Детям',
    'Туры',
    'Мастер-классы',
    'Музеи',
    'Развлечения',
]

async function writeDataCategory(){
    const length = await Categories.countDocuments();
    if(length == 0){
        data.map((item, index) => {
            new Categories({
                name: item,
                key: index
            }).save()
        })
    }
}

module.exports = writeDataCategory