import { Inter } from "next/font/google"
import { useForm } from "react-hook-form"
import { UploadFileResponse } from "uploadthing/client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UploadFileCustom } from "@/components/upload-file-custom/UploadFileCustom"
import { uploadFileResponseSchema } from "@/schemas/uploadFileResponseSchema"

const inter = Inter({ subsets: ["latin"] })

export const formSchema = z.object({
  username: z.string().nonempty("Username is required."),
  profile_pic: z.array(uploadFileResponseSchema).min(1, "Escolha pelo menos uma foto de perfil."),
})

export default function Home() {
  const form = useForm<
    z.infer<typeof formSchema> & {
      profile_pic: UploadFileResponse[]
    }
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      profile_pic: [],
    },
    mode: "onTouched",
  })

  const { isSubmitting, errors } = form.formState

  if (Object.keys(errors).length) console.log(errors)

  function onSubmit(values: z.infer<typeof formSchema>) {
    type APIBody = {
      username: string
      profile_pic: string[]
    }

    function getAPIBody(formValues: z.infer<typeof formSchema>): APIBody {
      const { profile_pic, username } = formValues

      return {
        profile_pic: profile_pic.map(p => p.url),
        username,
      }
    }

    const apibody = getAPIBody(values)

    console.log(apibody)
  }

  return (
    <main className={cn("min-h-screen grid place-items-center", inter.className)}>
      <Card className="max-w-[26rem] w-full">
        <CardHeader>
          <CardTitle>Upload Thing Example</CardTitle>
          <CardDescription>
            Learning how to upload files from client to database with Upload Thing!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="vitormarkis"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profile_pic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <UploadFileCustom
                        endpoint="imageUploader"
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <UploadFileCustom
                endpoint="imageUploader"
                value={[
                  {
                    key: "jidjfsd",
                    name: "random-guy.png",
                    url: "https://pbs.twimg.com/media/F5hpy96aMAAPid-?format=jpg&name=medium",
                    size: 2,
                    fileKey: "jidjfsd",
                    fileName: "random-guy.png",
                    fileUrl: "https://pbs.twimg.com/media/F5hpy96aMAAPid-?format=jpg&name=medium",
                    fileSize: 2,
                  },
                  {
                    key: "jidjfsd",
                    name: "random-guy.png",
                    url: "https://utfs.io/f/c74a0f25-2adc-4072-a5e9-b69b4a61abc6_Rectangle%2060.png",
                    size: 2,
                    fileKey: "jidjfsd",
                    fileName: "random-guy.png",
                    fileUrl:
                      "https://utfs.io/f/c74a0f25-2adc-4072-a5e9-b69b4a61abc6_Rectangle%2060.png",
                    fileSize: 2,
                  },
                ]}
                onChange={console.log}
                name="photos"
              /> */}

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
