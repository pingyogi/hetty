import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Chip,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { SCOPE } from "./Rules";
import { ScopeRule } from "../../lib/scope";

const SET_SCOPE = gql`
  mutation SetScope($scope: [ScopeRuleInput!]!) {
    setScope(scope: $scope) {
      url
    }
  }
`;

type RuleListItemProps = {
  scope: ScopeRule[];
  rule: ScopeRule;
  index: number;
};

function RuleListItem({ scope, rule, index }: RuleListItemProps): JSX.Element {
  const client = useApolloClient();
  const [setScope, { loading }] = useMutation(SET_SCOPE, {
    update(_, { data: { setScope } }) {
      client.writeQuery({
        query: SCOPE,
        data: { scope: setScope },
      });
    },
  });

  const handleDelete = (index: number) => {
    const clone = [...scope];
    clone.splice(index, 1);
    setScope({
      variables: {
        scope: clone.map(({ url }) => ({ url })),
      },
    });
  };

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <CodeIcon />
        </Avatar>
      </ListItemAvatar>
      <RuleListItemText rule={rule} />
      <ListItemSecondaryAction>
        <RuleTypeChip rule={rule} />
        <Tooltip title="Delete rule">
          <span style={{ marginLeft: 8 }}>
            <IconButton onClick={() => handleDelete(index)} disabled={loading}>
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function RuleListItemText({ rule }: { rule: ScopeRule }): JSX.Element {
  let text: JSX.Element = <div></div>;

  if (rule.url) {
    text = <code>{rule.url}</code>;
  }

  // TODO: Parse and handle rule.header and rule.body.

  return <ListItemText>{text}</ListItemText>;
}

function RuleTypeChip({ rule }: { rule: ScopeRule }): JSX.Element {
  let label = "Unknown";

  if (rule.url) {
    label = "URL";
  }

  return <Chip label={label} variant="outlined" />;
}

export default RuleListItem;
