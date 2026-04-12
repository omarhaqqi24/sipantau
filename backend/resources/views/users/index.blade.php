@extends('layouts.base')

@section("style")

<style>
    input {
        display: inline-block;
        border: 1px solid #000000;
        /* background-color: #070707;
        color: #fff; */
        margin-right: 10px;
        margin-top: 10px;
    }

    button {
        background-color: #000;
        color: #fff;
        padding: 0 10px;
    }

    input, button {
        border-radius: 10px;
    }
</style>

@endsection

@section('content')

<h1>Add User</h1>
<hr>
<form>
    <label for="nama">Nama</label>
    <input type="text" name="nama" id="nama">
    <label for="mail">E-mail</label>
    <input type="text" name="mail" id="mail">
    <label for="pass">Password</label>
    <input type="text" name="pass" id="pass">
    <label for="role">Role</label>
    <input type="text" name="role" id="role">
    <button>add</button>
</form>
<br>
<h1>Users List</h1>
<hr>
<br>
<ul>
    <li>Nama: ini nama</li>
    <li>email: ini email</li>
    <li>password: ini password</li>
    <li>role: ini role</li>
    <li>crt_at: ini crt_at</li>
    <li>upt_at: ini upt_at</li>
</ul>
<br>
<ul>
    <li>Nama: ini nama</li>
    <li>email: ini email</li>
    <li>password: ini password</li>
    <li>role: ini role</li>
    <li>crt_at: ini crt_at</li>
    <li>upt_at: ini upt_at</li>
</ul>

@endsection