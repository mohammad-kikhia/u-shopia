import { getDictionary, Locale } from '@/app/[lang]/dictionaries';
import { validateInput } from '@/lib/validateInput';
import { NextRequest, NextResponse } from 'next/server';

const serviceID = process.env.serviceID;
const publicKey = process.env.publicKey;
const templateID = process.env.templateID;

export async function POST(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get('lang') || 'en';
  const dictionary = await getDictionary(lang as Locale);
  const t = dictionary.contact;

  const body = await req.json();
  const { name, email, subject, message } = body;

  const params = {
    user_id: publicKey,
    service_id: serviceID,
    template_id: templateID,
    template_params: {
      name,
      email,
      subject,
      message,
    },
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  try {
    const validationError = validateInput({ name, email, subject, message });
    if (validationError) {
      return NextResponse.json(
        {
          status: 400,
          message: t?.errors?.[validationError?.error],
        },
        { status: 400 },
      );
    }

    const response = await fetch(
      'https://api.emailjs.com/api/v1.0/email/send',
      options,
    );

    // EmailJS returns plain text, not JSON - read as text to check for errors
    const responseText = await response.text();

    if (response.ok) {
      return NextResponse.json(
        { status: 200, message: t?.success },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          status: 500,
          message: t?.errors?.default,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 500,
        message: t?.errors?.default,
      },
      { status: 500 },
    );
  }
}
