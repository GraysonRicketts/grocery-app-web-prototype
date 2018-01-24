import React from 'react';

import Item from './Item';

class Category extends React.Component {
  render() {
    const items = this.props.items.map((item) => {
      return (
        <Item itemName={item.itemName}
        size={item.size}
        quantity={item.quantity}
        key={item._id}/>
      );
    });

    const categoryName = this.props.categoryName;

    const style = {
      width: '100%',
      marginBottom: '45px'
    };

    return (
      <div style={style}>
        <h4 className="row" style={{width: '100%'}}>
          {categoryName}
        </h4>

        {items}
      </div>
    );
  }
}

export default Category;
