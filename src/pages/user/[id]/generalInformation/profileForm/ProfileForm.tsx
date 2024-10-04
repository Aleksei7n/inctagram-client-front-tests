import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { Button, TextArea } from '@honor-ui/inctagram-ui-kit'
import { useGetCitiesListMutation, useGetCountriesListQuery } from '@/api/countries-api'
import { useEffect, useId, useMemo, useState } from 'react'
import { ControlledSelect } from '@/components/controlled/ControledSelect'
import { DatePicker } from '@/components/datePicker'
import { format, parse } from 'date-fns'

import s from './profileForm.module.scss'

type DefaultDataValueType = {
    userName: string
    firstName: string
    lastName: string
    dateOfBirth: string
    country: string
    city: string
    about: string
}

type Props = {
    onSubmit: (data: FormChangeGeneralInformation) => void
    defaultDataValue?: DefaultDataValueType
}

const changeGeneralInformationSchema = z.object({
    userName: z
        .string()
        .min(6, { message: 'Minimum 6 characters' })
        .max(30, { message: 'Maximum 30 characters' })
        .refine(value => /^[0-9A-Za-z_\-]+$/.test(value), {
            message: 'Allowed characters: 0-9, A-Z, a-z, _, -',
        }),
    firstName: z
        .string()
        .min(1, { message: 'Minimum 1 character' })
        .max(50, { message: 'Maximum 50 characters' })
        .refine(value => /^[A-Za-zА-Яа-я]+$/.test(value), {
            message: 'Allowed characters: A-Z, a-z, А-Я, а-я',
        }),
    lastName: z
        .string()
        .min(1, { message: 'Minimum 1 character' })
        .max(50, { message: 'Maximum 50 characters' })
        .refine(value => /^[A-Za-zА-Яа-я]+$/.test(value), {
            message: 'Allowed characters: A-Z, a-z, А-Я, а-я',
        }),
    dateOfBirth: z
        .string()
        .min(10, { message: 'Enter the date in the format dd.mm.yyyy' })
        .max(10, { message: 'Enter the date in the format dd.mm.yyyy' })
        .refine(value => /^\d{2}\.\d{2}\.\d{4}$/.test(value), {
            message: 'Invalid date format, use dd.mm.yyyy',
        }),
    country: z.string().min(1, { message: 'Country is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    about: z
        .string()
        .max(200, { message: 'Maximum 200 characters' })
        .refine(value => /^[0-9A-Za-zА-Яа-я\s\-_.,!]*$/.test(value), {
            message: 'Allowed characters: 0-9, A-Z, a-z, А-Я, а-я, and special characters',
        }),
})

export type FormChangeGeneralInformation = z.infer<typeof changeGeneralInformationSchema>

const ProfileForm = ({ onSubmit, defaultDataValue }: Props) => {

    const { control, register, trigger, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormChangeGeneralInformation>({
        resolver: zodResolver(changeGeneralInformationSchema),
        defaultValues: {
            userName: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            country: '',
            city: '',
            about: '',
        },
    })

    const { data, error, isLoading } = useGetCountriesListQuery()
    const [getCities, { data: citiesData, isLoading: citiesLoading }] = useGetCitiesListMutation()

    const [startDate, setStartDate] = useState<Date | undefined>(undefined)

    const selectedCountry = watch('country')
    const formId = useId()


    useEffect(() => {
        if (defaultDataValue) {
            console.log(new Date(defaultDataValue.dateOfBirth))
            setValue('userName', defaultDataValue.userName)
            setValue('firstName', defaultDataValue.firstName)
            setValue('lastName', defaultDataValue.lastName)
            setValue('country', defaultDataValue.country)
            const timer = setTimeout(() => {
                setValue('city', defaultDataValue.city)
            }, 2000)
            setValue('about', defaultDataValue.about)
            setValue('dateOfBirth', format(defaultDataValue.dateOfBirth, 'dd.MM.yyyy'))
            setStartDate(new Date(defaultDataValue.dateOfBirth))
            return () => clearTimeout(timer)
        }
    }, [defaultDataValue, setValue])


    useEffect(() => {
        if (selectedCountry) {
            getCities({ country: selectedCountry })
        }
    }, [selectedCountry, getCities])

    const optionsCountry = useMemo(() => {
        if (data && !isLoading && !error) {
            return data.data.map(country => ({
                label: country.country,
                value: country.country,
            }))
        }
        return []
    }, [data, isLoading, error])

    const optionsCity = useMemo(() => {
        if (citiesData && !citiesLoading) {
            return citiesData.data.map(city => ({
                label: city,
                value: city,
            }));
        }
        return [];
    }, [citiesData, citiesLoading])

    return (
        <div className={s.wrapper}>
            <form className={s.form} id={formId} onSubmit={handleSubmit(onSubmit)}>
                <div className={s.inputWrapper}>
                    <ControlledInput
                        control={control}
                        label={'Username'}
                        name={'userName'}
                        trigger={trigger}
                        className={s.input}
                    />
                    <ControlledInput
                        control={control}
                        label={'First Name'}
                        name={'firstName'}
                        trigger={trigger}
                        className={s.input}
                    />
                    <ControlledInput
                        control={control}
                        label={'Last Name'}
                        name={'lastName'}
                        trigger={trigger}
                        className={s.input}
                    />
                </div>
                <DatePicker
                    label={'Date of birth'}
                    setStartDate={(date) => {
                        setStartDate(date)
                        setValue('dateOfBirth', date ? format(date, 'dd.MM.yyyy') : '')
                    }}
                    startDate={startDate}
                    errorMessage={errors.dateOfBirth?.message}
                />
                <div className={s.wrapperSelect}>
                    <ControlledSelect
                        control={control}
                        label={'Select your country'}
                        name={'country'}
                        options={optionsCountry}
                        className={s.select} />
                    <ControlledSelect
                        control={control}
                        label={'Select your city'}
                        name={'city'}
                        options={optionsCity}
                        disabled={!selectedCountry}
                        className={s.select} />
                </div>
                <TextArea
                    label={'About Me'}
                    {...register('about')}
                    className={s.textArea} />
                <div className={s.buttonContainer}>
                    <Button>Save Change</Button>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm