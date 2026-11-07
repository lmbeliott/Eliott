#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

int main() {
    long long n, d;
    cin >> n >> d;
    long long entier = n / d;
    long long reste = n % d;

    string chiffres = "";                 // les chiffres après la virgule
    unordered_map<long long, int> position; // reste -> position du chiffre qu'il va produire
    while (reste != 0 && position.count(reste) == 0) {
        position[reste] = chiffres.size();
        reste = reste * 10;
        chiffres += (char)('0' + reste / d);  // division posée : un chiffre de plus
        reste = reste % d;
    }

    if (chiffres.size() == 0) {
        cout << entier << "\n";
    } else if (reste == 0) {              // le développement s'arrête
        cout << entier << "." << chiffres << "\n";
    } else {                              // le reste revient : la suite se répète
        int debut = position[reste];
        cout << entier << "." << chiffres.substr(0, debut) << "(" << chiffres.substr(debut) << ")\n";
    }
    return 0;
}
