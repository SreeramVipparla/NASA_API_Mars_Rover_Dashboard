class A:
  def _init_(self):
    self._i=1
    self.j=5

  def display(self):
      print(self._i,self.j)
class B(A):
  def _init_(self):
    super()._init_()
    self._i=2
    self.j=7
c=B()
c.display()