import { GridItem, GridItemProps } from "@chakra-ui/react";

export const MainGridItem = (props: GridItemProps) => (
  <GridItem
    height="40vh"
    rowSpan={1}
    colSpan={2}
    borderColor={"black"}
    borderWidth={1}
    borderRadius={5}
    p={"1rem"}
    _dark={{
      borderColor: "white",
    }}
    {...props}
  />
);
