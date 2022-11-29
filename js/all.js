let data;
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json').then(function (response) {
    data = response.data.data;
    renderData(data);
    renderC3();
})



// 資料渲染
const ticketCard = document.querySelector('.ticketCard-area');
const searchResult = document.querySelector('#searchResult-text');
function renderData(data) {
    let str = '';
    data.forEach(function (value, index) {
        str += `<li class="ticketCard">
    <div class="ticketCard-img">
        <a href="#">
            <img src="${value.imgUrl}"
                alt="">
        </a>
        <div class="ticketCard-region">${value.area}</div>
        <div class="ticketCard-rank">${value.rate}</div>
    </div>
    <div class="ticketCard-content">
        <div>
            <h3>
                <a href="#" class="ticketCard-name">${value.name}</a>
            </h3>
            <p class="ticketCard-description">
                ${value.description}
            </p>
        </div>
        <div class="ticketCard-info">
            <p class="ticketCard-num">
                <span><i class="fas fa-exclamation-circle"></i></span>
                剩下最後 <span id="ticketCard-num"> ${value.group} </span> 組
            </p>
            <p class="ticketCard-price">
                TWD <span id="ticketCard-price">$${value.price}</span>
            </p>
        </div>
    </div>
</li>`;
    })
    ticketCard.innerHTML = str;
    searchResult.textContent = `本次搜尋共 ${data.length} 筆資料`;
}

// 篩選邏輯
const regionSearch = document.querySelector('.regionSearch');
const cantFind = document.querySelector('.cantFind-area');
regionSearch.addEventListener('change', function (e) {
    str = '';
    let count = 0;
    data.forEach(function (value, index) {
        if (regionSearch.value == value.area) {
            str += `<li class="ticketCard">
    <div class="ticketCard-img">
        <a href="#">
            <img src="${value.imgUrl}"
                alt="">
        </a>
        <div class="ticketCard-region">${value.area}</div>
        <div class="ticketCard-rank">${value.rate}</div>
    </div>
    <div class="ticketCard-content">
        <div>
            <h3>
                <a href="#" class="ticketCard-name">${value.name}</a>
            </h3>
            <p class="ticketCard-description">
                ${value.description}
            </p>
        </div>
        <div class="ticketCard-info">
            <p class="ticketCard-num">
                <span><i class="fas fa-exclamation-circle"></i></span>
                剩下最後 <span id="ticketCard-num"> ${value.group} </span> 組
            </p>
            <p class="ticketCard-price">
                TWD <span id="ticketCard-price">$${value.price}</span>
            </p>
        </div>
    </div>
</li>`;
            count += 1;
        }
        else if (regionSearch.value == '') {
            str += `<li class="ticketCard">
            <div class="ticketCard-img">
                <a href="#">
                    <img src="${value.imgUrl}"
                        alt="">
                </a>
                <div class="ticketCard-region">${value.area}</div>
                <div class="ticketCard-rank">${value.rate}</div>
            </div>
            <div class="ticketCard-content">
                <div>
                    <h3>
                        <a href="#" class="ticketCard-name">${value.name}</a>
                    </h3>
                    <p class="ticketCard-description">
                        ${value.description}
                    </p>
                </div>
                <div class="ticketCard-info">
                    <p class="ticketCard-num">
                        <span><i class="fas fa-exclamation-circle"></i></span>
                        剩下最後 <span id="ticketCard-num"> ${value.group} </span> 組
                    </p>
                    <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">$${value.price}</span>
                    </p>
                </div>
            </div>
        </li>`;
            count += 1;
        }
    })
    if (count == 0) {
        cantFind.style.display = 'block';
    }
    else {
        cantFind.style.display = 'none';
    }
    ticketCard.innerHTML = str;
    searchResult.textContent = `本次搜尋共 ${count} 筆資料`;
})

// 新增資料
const ticketName = document.querySelector('#ticketName');
const ticketImgUrl = document.querySelector('#ticketImgUrl');
const ticketRegion = document.querySelector('#ticketRegion');
const ticketPrice = document.querySelector('#ticketPrice');
const ticketNum = document.querySelector('#ticketNum');
const ticketRate = document.querySelector('#ticketRate');
const ticketDescription = document.querySelector('#ticketDescription');
const addTicket = document.querySelector('.addTicket-btn');
const addTicketForm = document.querySelector('.addTicket-form');
addTicket.addEventListener('click', function (e) {
    if (ticketName.value == '' || ticketImgUrl.value == '' || ticketRegion.value == '' || ticketPrice.value == '' || ticketNum.value == '' || ticketRate.value == '' || ticketDescription.value == '') {
        Swal.fire(
            '資料不完整!',
            '請完整填寫資料，感謝!',
            'error'
        );
        addTicketForm.reset();
    }
    else {
        let obj = {};
        obj.id = data.length;
        obj.name = ticketName.value;
        obj.imgUrl = ticketImgUrl.value;
        obj.area = ticketRegion.value;
        obj.description = ticketDescription.value;
        obj.group = parseInt(ticketNum.value);
        obj.price = parseInt(ticketPrice.value);
        obj.rate = parseInt(ticketRate.value);
        data.push(obj);
        renderData(data);
        renderC3();
        Swal.fire(
            '成功!',
            '資料成功填寫!',
            'success'
        );
        addTicketForm.reset();
    }
})

//圖表資料篩選
// areaObj {高雄: 1, 台北: 1, 台中: 1}
//     ['台北', 30],
//     ['台中', 120],
//     ['高雄', 120]
function renderC3() {
    let areaObj = {};
    let areaAry = [];
    let areaKeys;
    data.forEach(function (value) {
        if (areaObj[value.area] == undefined) {
            areaObj[value.area] = 1;
        }
        else {
            areaObj[value.area] += 1;
        }
    })
    areaKeys = Object.keys(areaObj);
    areaKeys.forEach(function (value) {
        let ary = [];
        ary.push(value);
        ary.push(areaObj[value]);
        areaAry.push(ary);
    })
    var chart = c3.generate({
        bindto: '#donut-chart',
        data: {
            columns: areaAry,
            type: 'donut',
            colors: {
                "高雄": "#E68618",
                "台中": "#5151D3",
                "台北": "#26BFC7"
            }
        },
        donut: {
            title: "套票地區比重"
        },
        size: {
            width: 250,
            height: 250
        }
    });
}

