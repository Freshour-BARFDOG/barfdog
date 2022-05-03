import React, { Component } from "react";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
  arrayMove
} from "react-sortable-hoc";

import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";




const DragHandle = sortableHandle(() => <span>::</span>);

const SortableItem = sortableElement(({ value }) => (
  <li>
    <DragHandle />
    {value}
  </li>
));

const SortableContainer = sortableContainer(({ children }) => {
  return <ul>{children}</ul>;
});

class App extends Component {
  state = {
    items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"],
  };
  

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));
  };

  render() {
    const { items } = this.state;

    return (
      <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
        {items.map((value, index) => (
          <SortableItem key={`item-${value}`} index={index} value={value} />
        ))}
      </SortableContainer>
    );
  }
}




function Popup() {
  return (
    <>
      <MetaTitle title="팝업 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>팝업 리스트 페이지</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default Popup;
