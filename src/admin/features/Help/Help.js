import React from "react";
import { Accordion, Item, Icon, Segment, Button } from "semantic-ui-react";
import { partial } from "lodash";
import Aux from "react-aux";

import AdminAPI from "../../services";
import ModelManager from "../../components/ModelManager";

function HelpItem({
  admin,
  edit,
  remove,
  index,
  activeIndex,
  handleClick,
  title,
  content
}) {
  return (
    <Aux>
      <Accordion.Title
        className="Help-item"
        active={activeIndex === index}
        index={index}
        onClick={handleClick}
      >
        <Icon name="dropdown" /> {title}
      </Accordion.Title>
      <Accordion.Content
        className="Help-content"
        active={activeIndex === index}
        dangerouslySetInnerHTML={{
          __html: content
        }}
      />
      {admin && (
        <Segment basic>
          <Button icon="pencil" content="Edit" primary onClick={edit} />
          <Button icon="trash" content="Remove" negative onClick={remove} />
        </Segment>
      )}
    </Aux>
  );
}

export default function HelpManager({ history }) {
  const config = {
    fetchItems: AdminAPI.fetchHelpItems,
    deleteItem: AdminAPI.deleteHelp,
    term: "help",
    resource: "help",
    render: (items, _edit, _remove) => (
      <Item.Group divided>
        {items.map((item, index) => {
          const edit = partial(_edit, item.id);
          const remove = partial(_remove, item.id);
          const currentIndex = 1;
          const activeIndex = 1;
          const handleClick = () => {};
          const { title, content } = item;

          return (
            <Accordion key={index} styled fluid>
              <HelpItem
                admin
                {...{
                  index: currentIndex,
                  activeIndex,
                  handleClick,
                  title,
                  content,
                  edit,
                  remove
                }}
              />
            </Accordion>
          );
        })}
      </Item.Group>
    )
  };

  return <ModelManager {...{ history }} {...config} />;
}
