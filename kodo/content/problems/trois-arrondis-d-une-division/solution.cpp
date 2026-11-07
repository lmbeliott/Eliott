#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    long long inferieur = a / b;
    long long superieur = (a + b - 1) / b;
    long long proche = (2 * a + b) / (2 * b);   // arrondi inférieur de a/b + 1/2
    cout << inferieur << " " << superieur << " " << proche << "\n";
    return 0;
}
