import { Controller, useForm, useWatch } from "react-hook-form";
import { CHARACTER_STATUSES, type CharacterFiltersFormProps, type FilterValues } from "../schema";
import { MenuItem, Stack, TextField } from "@mui/material";
import { useEffect, useEffectEvent, useRef } from "react";
import { useDebouncedValue } from "../../../lib/useDebouncedValue";

export function CharacterFiltersForm({ value, onChange }: CharacterFiltersFormProps) {
    
    const { control, reset } = useForm<FilterValues>({ defaultValues: value })

    const name = useWatch({ control, name: 'name' })
    const status = useWatch({ control, name: 'status' })
    const debouncedName = useDebouncedValue(name, 400)

    const lastSynced = useRef(value)
    const emitChange = useEffectEvent(onChange)

    useEffect(() => {
        const next = { name: debouncedName.trim(), status }
        if (next.name === lastSynced.current.name && next.status === lastSynced.current.status) return
        lastSynced.current = next
        emitChange(next)
    }, [debouncedName, status])

    useEffect(() => {
    const external = { name: value.name, status: value.status }
    if (
      external.name === lastSynced.current.name &&
      external.status === lastSynced.current.status
    ) {
      return
    }
    lastSynced.current = external
    reset(external)
  }, [value.name, value.status, reset])
  
    return (
        <Stack
            component="form"
            role="search"
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            onSubmit={(event) => event.preventDefault()}
            sx={{ mb: 2, alignItems: { sm: 'flex-end' } }}
        >
            <Controller
                control={control}
                name="name"
                render={({ field }) => (
                <TextField {...field} label="Buscar por nombre" type="search" fullWidth autoFocus />
                )}
            />
            <Controller
                control={control}
                name="status"
                render={({ field }) => (
                <TextField {...field} select label="Estado" sx={{ minWidth: 180 }}>
                    <MenuItem value="">Todos</MenuItem>
                    {CHARACTER_STATUSES.map((s) => (
                        <MenuItem key={s} value={s}>
                            {s}
                        </MenuItem>
                    ))}
                </TextField>
                )}
            />
        </Stack>
    );
}