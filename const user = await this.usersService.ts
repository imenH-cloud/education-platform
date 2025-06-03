 const user = await this.usersService.findOne(email);
    if (user) {
      const isPasswordMatching = await bcrypt.compare(pass, user.password);
      if (isPasswordMatching) {
        const { token, saltRounds, password, ...result } = user;
        return result;
      }
    }
    return null;