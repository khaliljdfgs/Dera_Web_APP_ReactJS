import React from 'react'
import MaterialReactTable from 'material-react-table'

const CustomDataTable = ({
  state,
  columns,
  data,
  renderTopToolbarCustomActions,
  renderRowActions,
}) => {

  return (
    <MaterialReactTable
      enableColumnActions={false}
      enableFilters={true}
      state={state}
      columns={columns}
      data={data}
      initialState={{
        density: 'compact', pagination: {
          pageSize: 15,
        }
      }}
      enableColumnFilters={true}
      enablePagination={true}
      enableSorting={true}
      enableBottomToolbar={true}
      enableTopToolbar={true}
      enableEditing={true}
      enableFullScreenToggle={false}
      enableDensityToggle={false}
      enableHiding={false}
      positionActionsColumn='last'
      renderTopToolbarCustomActions={renderTopToolbarCustomActions}
      renderRowActions={renderRowActions}
    />
  )
}

export default CustomDataTable
