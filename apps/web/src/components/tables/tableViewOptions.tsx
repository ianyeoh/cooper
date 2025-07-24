// "use client";

// import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
// import { MixerHorizontalIcon } from "@radix-ui/react-icons";
// import { Table } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdownMenu";
// import { useMediaQuery } from "@/hooks/useMediaQuery";

// interface DataTableViewOptionsProps<TData> {
//   table: Table<TData>;
// }

// export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
//   const isDesktop = useMediaQuery("(min-width: 768px)");

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" className="px-3 gap-2">
//           <MixerHorizontalIcon className="h-4" />
//           {isDesktop && "View"}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-[150px]">
//         <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         {table
//           .getAllColumns()
//           .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
//           .map((column) => {
//             return (
//               <DropdownMenuCheckboxItem
//                 key={column.id}
//                 className="capitalize"
//                 checked={column.getIsVisible()}
//                 onCheckedChange={(value) => column.toggleVisibility(!!value)}
//               >
//                 {column.id}
//               </DropdownMenuCheckboxItem>
//             );
//           })}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
