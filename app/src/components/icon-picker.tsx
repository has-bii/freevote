"use client"

import React from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IconName, iconNames } from "lucide-react/dynamic"
import DynamicIconn from "./dynamic-icon"
import {
  FixedSizeGrid as Grid,
  GridChildComponentProps,
  areEqual,
} from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import { useDebounce } from "use-debounce"

interface IconPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelectIcon?: (value: string) => void
  icon?: string
}

type IconProps = {
  name: string
  icon?: string
  onSelectIcon?: (value: string) => void
}

const Icon = React.memo(
  ({ name, icon, onSelectIcon }: IconProps) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant={icon === name ? "default" : "ghost"}
          onClick={() => onSelectIcon?.(name)}
          aria-label={`Select ${name} icon`}
          className="[&_svg]:size-5"
        >
          <DynamicIconn name={name as IconName} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  ),
  areEqual,
)

Icon.displayName = "Icon"

const IconPicker = React.memo(
  React.forwardRef<HTMLDivElement, IconPickerProps>(
    ({ onSelectIcon, icon, ...props }, ref) => {
      const [searchQuery, setSearchQuery] = React.useState("")
      const [debouncedQuery] = useDebounce(searchQuery, 300)

      // Optimized search with memoization
      const filteredIconNames = React.useMemo(() => {
        const query = debouncedQuery.toLowerCase()
        return iconNames.filter((name) => name.toLowerCase().includes(query))
      }, [debouncedQuery])

      const columnCount = 6
      const rowCount = Math.ceil(filteredIconNames.length / columnCount)

      const renderIcon = React.useCallback(
        ({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
          const index = rowIndex * columnCount + columnIndex
          if (index >= filteredIconNames.length) return null

          const name = filteredIconNames[index]

          return (
            <div style={style} className="flex items-center justify-center">
              <Icon name={name} icon={icon} onSelectIcon={onSelectIcon} />
            </div>
          )
        },
        [filteredIconNames, icon, onSelectIcon],
      )

      return (
        <div className="h-fit w-full space-y-2" {...props} ref={ref}>
          <Input
            placeholder="Search icon name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <TooltipProvider>
            <div className="-mr-4 h-96 w-full">
              <AutoSizer>
                {({ height, width }) => (
                  <Grid
                    className="test"
                    height={height}
                    width={width}
                    columnCount={columnCount}
                    columnWidth={39}
                    rowCount={rowCount}
                    rowHeight={36}
                  >
                    {renderIcon}
                  </Grid>
                )}
              </AutoSizer>
            </div>
          </TooltipProvider>
        </div>
      )
    },
  ),
)

IconPicker.displayName = "IconPicker"

export default IconPicker
