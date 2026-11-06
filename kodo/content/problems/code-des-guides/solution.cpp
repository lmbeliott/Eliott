#include <iostream>
#include <string>
using namespace std;

int main() {
    int k;
    cin >> k;
    cin.ignore();  // saute le retour à la ligne qui suit K
    string message;
    getline(cin, message);

    string decode = "";
    for (char c : message) {
        if (c == ' ') {
            // Les espaces ne sont pas codés.
            decode += ' ';
        } else {
            // Position de la lettre dans l'alphabet (0 pour a, 25 pour z).
            // On recule de k places ; on ajoute 26 pour ne jamais passer
            // en dessous de 0, car en C++ le % d'un nombre négatif est négatif.
            int position = (c - 'a' - k + 26) % 26;
            decode += (char)('a' + position);
        }
    }

    cout << decode << "\n";
    return 0;
}
