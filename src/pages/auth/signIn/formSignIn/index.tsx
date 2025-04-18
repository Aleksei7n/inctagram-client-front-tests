import { useId } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Button, Cards, Typography } from '@honor-ui/inctagram-ui-kit'
import '@honor-ui/inctagram-ui-kit/css'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signInSchema } from '@/shared/const/validationSchemas'
import s from './formSignIn.module.scss'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import AuthProviders from '../../authProviders'

type Props = {
  onSubmit: (data: SignInForm) => void
  errorMessage: string
  onSignGoogle: () => void
  onSignGit: () => void
}

export type SignInForm = z.infer<typeof signInSchema>

const FormSignIn = ({ onSubmit, errorMessage, onSignGit, onSignGoogle }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
    trigger,
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const formId = useId()

  return (
    <Cards className={s.card}>
      <Typography as={'h1'} className={s.title}>
        Sign In
      </Typography>
      <AuthProviders onSignGit={onSignGit} onSignGoogle={onSignGoogle} />
      <form className={s.form} id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.containerInput}>
          <ControlledInput
            control={control}
            label={'Email'}
            name={'email'}
            trigger={trigger}
            className={s.input}
          />
          <ControlledInput
            control={control}
            label={'Password'}
            name={'password'}
            trigger={trigger}
            className={s.input}
            errorMessage={errorMessage}
          />
        </div>
        <Typography
          className={s.forgotPasswordLink}
          as={Link}
          href={'/auth/forgotPassword'}
          variant={'regular_link'}
        >
          Forgot Password
        </Typography>
        <Button form={formId} fullWidth disabled={!isValid} className={s.disabledButton}>
          Sign In
        </Button>
      </form>
      <div className={s.registration}>
        <Typography as={'h2'} className={s.registration} variant={'regular_text14'}>
          Don’t have an account?
        </Typography>
        <Link href={'/auth/signUp'}>
          <Button variant={'borderless'}>Sign Up</Button>
        </Link>
      </div>
    </Cards>
  )
}

FormSignIn.displayName = 'FormSignIn'

export default FormSignIn
