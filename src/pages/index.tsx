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
import { UploadButton } from "@/utils/uploadthing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Inter } from "next/font/google"
import { useForm } from "react-hook-form"
import * as z from "zod"

const inter = Inter({ subsets: ["latin"] })

const formSchema = z.object({
  username: z.string().nonempty("Username is required."),
  profile_pic: z.string().nonempty("Profile picture is required."),
})

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      profile_pic: "",
    },
    mode: "onTouched"
  })

  const { isSubmitting, errors } = form.formState

  if(Object.keys(errors)) console.log(errors)

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <main className="min-h-screen grid place-items-center">
      <Card className="min-w-[20rem]">
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
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        // Do something with the response
                        console.log("Files: ", res);
                        if(!res) return
                        const [file] = res
                        field.onChange(file.url)
                      }}
                      onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
