import React from 'react';

import Item from './Item/Item';

class Category extends React.Component {
  render() {
    const items = this.props.items.map((item) => {
      return (
        <Item itemName={item.itemName}
        size={item.size}
        quantity={item.quantity}
        note={item.note}
        key={item._id}/>
      );
    });

    const categoryName = this.props.categoryName;

    return (
      <div className='category'>
        <h3>
          {categoryName}
        </h3>

        {items}
      </div>
    );
  }
}

export default Category;