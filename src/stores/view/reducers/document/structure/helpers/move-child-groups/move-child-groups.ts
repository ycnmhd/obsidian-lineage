import { Columns, NodeId } from 'src/stores/view/view-state-type';
import { moveChildGroupsNextToTheirParent } from 'src/stores/view/reducers/document/structure/helpers/move-child-groups/move-child-groups-next-to-their-parent';
import { removeChildGroupsFromTheirColumns } from 'src/stores/view/reducers/document/structure/helpers/move-child-groups/remove-child-groups-from-their-columns';
import { moveOrphanGroupsToANewParent } from 'src/stores/view/reducers/document/structure/helpers/move-child-groups/move-orphan-groups-to-a-new-parent';
import { VerticalDirection } from 'src/stores/view/view-store-actions';

type Action =
    | {
          type: 'MOVE_PARENT';
          payload: {
              currentParent: NodeId;
          };
      }
    | {
          type: 'MERGE_PARENT';
          payload: {
              currentParent: NodeId;
              newParent: NodeId;
              direction: VerticalDirection;
          };
      };
export const moveChildGroups = (columns: Columns, action: Action) => {
    const sortedChildGroups = removeChildGroupsFromTheirColumns(
        columns,
        action.payload.currentParent,
    );
    if (action.type === 'MERGE_PARENT') {
        moveOrphanGroupsToANewParent(
            columns,
            action.payload.newParent,
            sortedChildGroups,
            action.payload.direction,
        );
    } else {
        moveChildGroupsNextToTheirParent(
            columns,
            action.payload.currentParent,
            sortedChildGroups,
        );
    }
};
