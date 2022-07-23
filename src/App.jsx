import './App.css';
import React, { useEffect, useState } from 'react';
import { Button, Select } from 'antd';
import { characterList, weaponList } from './data';

const { Option } = Select;

function App () {
  const map = {
    gold: characterList.filter(item => item.level === '五星'),
    purple: [...characterList.filter(item => item.level === '四星'), ...weaponList.filter(item => item.level === '四星' && item.origin === '祈愿')],
    blue: weaponList.filter(item => item.level === '三星' && item.origin === '祈愿')
  };
  const color = {
    五星: 'gold',
    四星: 'purple',
    三星: 'blue'
  };
  const [takeCount, setTakeCount] = useState({
    gold: 0,
    purple: 0,
    blue: 0,
    noPurpleCount: 0,
    noGoldCount: 0,
    noUpCount: 0
  });
  const [takeCard, setTakeCard] = useState({
    multiType: false,
    count: 0
  });
  const [takeData, setTakeData] = useState({
    stack: [],
    current: []
  });

  useEffect(() => {
    if (!takeCard.count) return;
    const cardArr = [];
    const cardCount = { ...takeCount };
    const len = takeCard.multiType ? 10 : 1;
    for (let index = 0; index < len; index++) {
      const card = getTakeCard(cardCount);
      console.log(cardCount);
      cardArr.push(card);
    }
    setTakeCount({ ...cardCount });
    setTakeData({
      stack: [...takeData.stack, ...cardArr],
      current: [...cardArr]
    });
  }, [takeCard]);

  const currentList = takeData.current.map((card, index) =>
    <div className='card' key={index}>
      <img className='icon' src={card.icon} />
      <span className={`stack-list-item ${color[card.level]}`}>
        {card.name}
      </span>
    </div>
  );

  const stackList = takeData.stack.map((card, index) =>
    <span className={`stack-list-item ${color[card.level]}`} key={index}>{card.name}</span>
  );

  function getTakeType (cardCount) {
    const probability = Math.round(Math.random() * 999);
    let goldValue = 6;
    let purple = 57;
    if (cardCount.noGoldCount > 73) {
      goldValue = 6 + (cardCount.noGoldCount - 73) * 60;
      if (goldValue > 1000)goldValue = 1000;
    }
    if (cardCount.noPurpleCount > 7) {
      purple = 57 + (cardCount.noPurpleCount - 7) * 510;
      if (purple > 1000)purple = 1000;
    }
    if (probability < goldValue && probability >= 0) {
      cardCount.noGoldCount = 0;
      cardCount.gold++;
      return 'gold';
    } else if (probability >= goldValue && probability <= purple) {
      cardCount.noPurpleCount = 0;
      cardCount.purple++;
      cardCount.noGoldCount++;
      return 'purple';
    } else {
      cardCount.blue++;
      cardCount.noGoldCount++;
      cardCount.noPurpleCount++;
      return 'blue';
    }
  }

  function getTakeCard (cardCount) {
    const type = getTakeType(cardCount);
    const num = Math.round(Math.random() * (map[type].length - 1));
    console.log(type, num, map[type][num]);
    return map[type][num];
  }

  function getTakeChannel (value) {
    if (value === 'character') {
      map.gold = characterList.filter(item => item.level === '五星');
    } else {
      map.gold = weaponList.filter(item => item.level === '五星' && item.origin === '祈愿');
    }
  }

  function onLuckyClick () {
    setTakeCard({
      ...takeCard,
      multiType: false,
      count: takeCard.count + 1
    });
  }

  function onLuckyMutiClick () {
    setTakeCard({
      ...takeCard,
      multiType: true,
      count: takeCard.count + 10
    });
  }

  return (
    <div className="App">
      <div className='panel'>
        <div className='stack-list'>{currentList}</div>
        <div>共计{takeCard.count}次,出金{takeCount.gold}次,出紫{takeCount.purple}次,出蓝{takeCount.blue}次</div>
        <Button type="primary" onClick={onLuckyClick}>抽1次</Button>
        <Button type="primary" onClick={onLuckyMutiClick}>抽10次</Button>
        <Select defaultValue="character" onChange={getTakeChannel}>
          <Option value="character">人物池</Option>
          <Option value="weapon">武器池</Option>
        </Select>
        <br/>
        <div className='stack-list'>{stackList}</div>
      </div>
    </div>
  );
}

export default App;
