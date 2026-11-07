#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    if (n == 0) {
        cout << 1 << "\n";      // 0 s'écrit avec un chiffre
    } else {
        int chiffres = 0;
        while (n > 0) {
            n = n / 10;         // on enlève le dernier chiffre
            chiffres = chiffres + 1;
        }
        cout << chiffres << "\n";
    }
    return 0;
}
